export default function Footer() {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-4 mt-5 border-top">
      <p className="col-md-4 mb-0 text-body-secondary">&copy; 2024 BACKAID</p>
      <ul className="nav col-md-4 justify-content-end">
        <li className="nav-item">
          <a href="/" className="nav-link px-2 text-body-secondary btn-link">
            HOME
          </a>
        </li>
        <li className="nav-item">
          <a href="" className="nav-link px-2 text-body-secondary btn-link">
            NEW CAMPAIGN
          </a>
        </li>
        <li className="nav-item">
          <a href="" className="nav-link px-2 text-body-secondary btn-link">
            DONATE
          </a>
        </li>
        <li className="nav-item">
          <a href="" className="nav-link px-0 text-body-secondary btn-link">
            ABOUT
          </a>
        </li>
      </ul>
    </footer>
  );
}
