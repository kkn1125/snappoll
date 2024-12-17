import { DOMAIN } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { PathDomain } from '@utils/PathDomain';
import * as prettier from 'prettier';

@Injectable()
export class BasicService {
  constructor(private readonly prisma: PrismaService) {}

  async sitemap() {
    const polls = await this.prisma.poll.findMany({
      include: { response: true },
    });
    const votes = await this.prisma.vote.findMany({
      include: { voteResponse: true },
    });
    const boards = await this.prisma.board.findMany({
      where: { deletedAt: null, isPrivate: false, isOnlyCrew: false },
    });

    const base = new PathDomain('').addPath('notice', 'about');
    const graph = new PathDomain('graph').addPath(
      'polls',
      'votes',
      ...polls.map((p) => 'polls/' + p.id),
      ...votes.map((p) => 'votes/' + p.id),
    );
    const auth = new PathDomain('auth').addPath('login', 'signup');
    const user = new PathDomain('user').addPath(
      'password',
      'profile',
      'response',
    );
    const board = new PathDomain('board').addPath(
      'community',
      'notice',
      'event',
      'faq',
      ...boards.map((board) => board.category + '/' + board.id),
    );
    const poll = new PathDomain('polls').include.addPath(
      'me',
      'me/response',
      'new',
      ...polls.map((p) => p.id),
      ...polls.map((p) => p.id + '/response'),
      ...polls.flatMap((p) =>
        p.response.map((res) => p.id + '/response/' + res.id),
      ),
    );
    const vote = new PathDomain('votes').include.addPath(
      'me',
      'me/response',
      'new',
      ...votes.map((v) => v.id),
      ...votes.map((v) => v.id + '/response'),
      ...votes.flatMap((v) =>
        v.voteResponse.map((res) => v.id + '/response/' + res.id),
      ),
    );

    const pages = [
      DOMAIN + '/',
      ...[base, auth, user, board, graph, poll, vote].flatMap((domain) =>
        domain.output(),
      ),
    ];
    const SitemapGeneratedDate = new Date().toISOString().slice(0, 10);

    const pageSitemap = (page) => `
      <url>
        <loc>${page}</loc>
        <lastmod>${SitemapGeneratedDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === DOMAIN + '/' ? 1 : 0.8}</priority>
      </url>
    `;

    const generateSitemap = () => {
      return pages.map(pageSitemap).join('');
    };

    const sitemapTemplate = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
      xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
        ${generateSitemap()}
      </urlset>
    `;
    const formatted = await prettier.format(sitemapTemplate.trim(), {
      parser: 'html',
    });

    // fs.writeFileSync(
    //   path.join(path.resolve(), 'public/sitemap.xml'),
    //   formatted,
    //   'utf8',
    // );

    return formatted;
  }
}
