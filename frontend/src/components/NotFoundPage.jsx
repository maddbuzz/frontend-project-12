// import { useRouteError, Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';

const NotFoundPage = () => (
  <div className="text-center">
    <Image
      src="404.svg"
      alt="Страница не найдена"
      fluid
      className="h-25"
    />
    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      <span>Но вы можете перейти </span>
      <Link to="/">на главную страницу</Link>
    </p>
  </div>
);

export default NotFoundPage;
