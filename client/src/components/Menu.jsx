import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/about" style={{ marginRight: '1rem' }}>About</Link>
      <Link to="/donate">Donate</Link>
    </nav>
  );
};

export default Menu;
