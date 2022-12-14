// import { useRouteError, Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';

const NotFoundPage = () => (
  <div className="text-center">
    <Image
      src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg"
      width="283px"
      height="283px"
    />
    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      <span>Но вы можете перейти </span>
      <Link to="/">на главную страницу</Link>
    </p>
  </div>
);

// const NotFoundPage = () => {
//   const error = useRouteError();
//   console.error(error);
//   return (
//     <div className="h-100">
//       <div className="h-100" id="chat">
//         <div className="d-flex flex-column h-100">
//           <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
//             <div className="container">
//               <a className="navbar-brand" href="/">Hexlet Chat</a>
//             </div>
//           </nav>
//           <div className="text-center">
//             <img alt="Страница не найдена" className="img-fluid h-25" src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg" />
//             <h1 className="h4 text-muted">Страница не найдена</h1>
//             <p className="text-muted">
//               Но вы можете перейти
//               <Link to="/">на главную страницу</Link>
//             </p>
//           </div>
//         </div>
//         <div className="Toastify" />
//       </div>
//     </div>
//   );
// }

export default NotFoundPage;
