import "./header.sass";
import Logo from "@assets/logo.svg";
import bag from "@assets/bag_icon.svg";

const Header = () => {
  return (
    <div className="header">
      <div className="header__logo">
        <img src={Logo} alt="Logo" />
      </div>

      <div className="header__bag">
        <img src={bag} alt="Bag" />
        <span>0</span>
      </div>
    </div>
  );
};

export default Header;
