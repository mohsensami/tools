import Wrapper from "../../hoc/Wrapper";
import Header from "../Header";
import Footer from "../Footer";

const Layout = (props) => {
  return (
    <Wrapper>
      <Header />
      <main>
        <div>{props.children}</div>
      </main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
