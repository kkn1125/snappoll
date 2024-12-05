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

    const base = new PathDomain('').addPath('notice', 'graph', 'about');
    const user = new PathDomain('user').addPath('login', 'signup', 'profile');
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
      DOMAIN,
      ...[base, user, poll, vote].flatMap((domain) => domain.output()),
    ];
    const SitemapGeneratedDate = new Date().toISOString().slice(0, 10);

    const pageSitemap = (page) => `
      <url>
        <loc>${page}</loc>
        <lastmod>${SitemapGeneratedDate}</lastmod>
        <priority>${page === DOMAIN + '/' ? 1 : 0.8}</priority>
      </url>
    `;

    const generateSitemap = () => {
      return pages.map(pageSitemap).join('');
    };

    const sitemapTemplate = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${generateSitemap()}
  </urlset>
  `;
    const formatted = await prettier.format(sitemapTemplate, {
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
