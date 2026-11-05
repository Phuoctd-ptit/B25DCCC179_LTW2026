import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error, buildTag }) => (
  <div>
    <NavBar />
    <main className="content">
      {loading ? (
        <p>Đang tải câu hỏi...</p>
      ) : error ? (
        <p className="error">Không tải được câu hỏi</p>
      ) : (
        <Outlet />
      )}
    </main>
    <footer className="footer">Phiên bản: {buildTag}</footer>
  </div>
);

export default Layout;
