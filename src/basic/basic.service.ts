import { DOMAIN } from '@common/variables';
import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { PathDomain } from '@utils/PathDomain';
import * as prettier from 'prettier';

@Injectable()
export class BasicService {
  constructor(private readonly prisma: PrismaService) {}

  async sitemap() {
    const polls = await this.prisma.poll.findMany();
    const votes = await this.prisma.vote.findMany();
    const boards = await this.prisma.board.findMany({
      where: { deletedAt: null, isOnlyCrew: false },
    });
    const sharePolls = await this.prisma.sharePoll.findMany({
      where: { deletedAt: null, url: { not: undefined } },
    });
    const shareVotes = await this.prisma.shareVote.findMany({
      where: { deletedAt: null, url: { not: undefined } },
    });

    const auth = new PathDomain('auth').addPath('login', 'signup', 'account');
    const board = new PathDomain('board').addPath(
      'community',
      'notice',
      'event',
      'faq',
      ...boards.map((board) => `${board.category}/${board.id}`),
    );
    const poll = new PathDomain('poll').include.addPath(
      ...polls.map((p) => p.id),
      ...sharePolls.map((share) => `share/?url=${share.url}`),
    );
    const vote = new PathDomain('vote').include.addPath(
      ...votes.map((v) => v.id),
      ...shareVotes.map((share) => `share/?url=${share.url}`),
    );
    const service = new PathDomain('service').addSubPath(poll, vote);
    const base = new PathDomain('').addPath(
      'about',
      'price',
      'price/change',
      'help',
    );
    base.addSubPath(auth, board, service);
    const paths = base.output();

    const SitemapGeneratedDate = new Date().toISOString(); /* .slice(0, 10) */

    const pageSitemap = (page) => `
      <url>
        <loc>${page}</loc>
        <lastmod>${SitemapGeneratedDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === DOMAIN + '/' ? 1 : 0.8}</priority>
      </url>
    `;

    const generateSitemap = () => {
      return paths.map(pageSitemap).join('');
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
