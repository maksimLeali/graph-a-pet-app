import { Redirect as RouterRedirect, Route as RouterRoute, Switch as RouterSwitch, Link as RouterLink } from 'react-router-dom'
import type { RedirectProps, RouteProps, SwitchProps, LinkProps } from 'react-router-dom'

const Redirect = (RouterRedirect as unknown) as React.ComponentClass<RedirectProps>
const Switch = (RouterSwitch as unknown) as React.ComponentClass<SwitchProps>
const Route = (RouterRoute as unknown) as React.ComponentClass<RouteProps>
const Link = (RouterLink as unknown) as React.ComponentClass<LinkProps>


export {Redirect, Switch, Route, Link} 