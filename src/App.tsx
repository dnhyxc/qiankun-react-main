
import RenderPage from "./pages";
import Header from "./components/Header";
import "./App.css";

interface IProps {
  loading?: boolean;
}

const App: React.FC<IProps> = ({ loading, ...props }) => {
  return (
    <div className="app-main">
      <header className="app-header">
        <Header />
      </header>
      <div className="app-sub">
        <RenderPage loading={loading} {...props} />
        <div id="sub-app-viewport"></div>
      </div>
    </div>
  );
};

export default App;
