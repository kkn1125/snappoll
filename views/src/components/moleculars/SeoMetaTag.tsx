import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router-dom';

interface SeoMetaTagProps {
  title: string;
  url: string;
  description: string;
  keywords: string[];
  author: string;
  image: string;
  site_name: string;
  type: string;
  canonical: string;
}
const SeoMetaTag: React.FC<SeoMetaTagProps> = ({
  title,
  url,
  description,
  keywords,
  author,
  image,
  site_name,
  type,
  canonical,
}) => {
  const locate = useLocation();
  const param = useParams();
  const [subTitle, setSubTitle] = useState('');

  useEffect(() => {
    let subTitle = '';
    const hasId = !!(param.id || param.responseId);

    if (locate.pathname.startsWith('/service/poll/me/response')) {
      subTitle = '나의 설문응답';
    } else if (locate.pathname.startsWith('/service/poll/me')) {
      subTitle = '나의 설문지';
    } else if (locate.pathname.startsWith('/service/poll/new')) {
      subTitle = '설문지 제작';
    } else if (locate.pathname.startsWith('/service/poll')) {
      if (hasId) subTitle = '설문지';
      else subTitle = '설문지 목록';
    } else if (locate.pathname.startsWith('/service/vote/me/response')) {
      subTitle = '나의 투표응답';
    } else if (locate.pathname.startsWith('/service/vote/me')) {
      subTitle = '나의 투표지';
    } else if (locate.pathname.startsWith('/service/vote/new')) {
      subTitle = '투표지 제작';
    } else if (locate.pathname.startsWith('/service/vote')) {
      if (hasId) subTitle = '투표지';
      else subTitle = '투표지 목록';
    } else if (locate.pathname.startsWith('/service/graph/poll')) {
      subTitle = '설문 그래프';
    } else if (locate.pathname.startsWith('/service/graph/vote')) {
      subTitle = '투표 그래프';
    } else if (locate.pathname.startsWith('/service/graph')) {
      subTitle = '그래프 보기';
    } else if (locate.pathname.startsWith('/service')) {
      subTitle = '서비스';
    } else if (locate.pathname.startsWith('/notice')) {
      subTitle = '알림';
    } else if (locate.pathname.startsWith('/user/response')) {
      subTitle = '나의 응답';
    } else if (locate.pathname.startsWith('/user/profile')) {
      subTitle = '프로필';
    } else if (locate.pathname.startsWith('/user/password')) {
      subTitle = '비밀번호 변경';
    } else if (locate.pathname.startsWith('/user')) {
      subTitle = '사용자정보';
    } else if (locate.pathname.startsWith('/about')) {
      subTitle = 'SnapPoll이란?';
    } else if (locate.pathname.startsWith('/auth/signup')) {
      subTitle = '회원가입';
    } else if (locate.pathname.startsWith('/auth/login')) {
      subTitle = '로그인';
    } else if (locate.pathname.startsWith('/auth')) {
      subTitle = '회원가입/로그인';
    }

    setSubTitle(subTitle);
    return () => {
      setSubTitle('');
    };
  }, [locate.pathname, param.id, param.responseId]);

  const memoSubTitle = useMemo(() => {
    const sub = subTitle ? ' | ' + subTitle : '';
    return title + sub;
  }, [subTitle, title]);

  const memoLocation = useMemo(() => {
    const href = location.origin + locate.pathname || url;
    return href;
  }, [locate.pathname, url]);

  return (
    /* @ts-ignore */
    <Helmet>
      <title>{memoSubTitle}</title>
      <link rel="canonical" href={canonical} />
      <meta name="site_name" content={site_name} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta property="og:title" content={memoSubTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={memoLocation} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={memoSubTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SeoMetaTag;
