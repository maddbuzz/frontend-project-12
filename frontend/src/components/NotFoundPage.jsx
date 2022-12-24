import Image from 'react-bootstrap/Image';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import paths from '../paths.js';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <Image
        src="404.svg"
        alt={t('Page not found')}
        fluid
        className="h-25"
      />
      <h1 className="h4 text-muted">{t('Page not found')}</h1>
      <p className="text-muted">
        <span>{t('But you can go ')}</span>
        <Link to={paths.chatPagePath()}>{t('to the main page')}</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
