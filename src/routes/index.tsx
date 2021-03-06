import { Route, Switch } from "react-router-dom";
import { AboutUs } from "../pages/AboutUs";
import { AnimePage } from "../pages/Animes";
import { Developers } from "../pages/Devs";
import { Home } from "../pages/Home";
import { Search } from "../pages/Search";
import { User } from "../pages/User";

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/animepage/:id" component={AnimePage} />
      <Route exact path="/search/:id" component={Search} />
      <Route exact path="/user" component={User} />
      <Route exact path="/aboutUs" component={AboutUs} />
      <Route exact path="/developers" component={Developers} />
    </Switch>
  );
};
