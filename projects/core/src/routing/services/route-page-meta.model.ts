import { Type } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BreadcrumbMeta } from '../../cms/model/page.model';

export interface RouteWithPageMetaConfig {
  data?: {
    cxPageMeta?: RoutePageMetaConfig;
  };
}

/**
 * Configuration of the breadcrumb for the Route.
 */
export interface RoutePageMetaConfig {
  /** Raw string for the breadcrumb label or the class implementing `PageBreadcrumbResolver` */
  breadcrumb?: string | RouteBreadcrumbConfig;
}

/**
 * Configuration of the breadcrumb for specific route
 */
export interface RouteBreadcrumbConfig {
  /**
   * Optional i18n key for the breadcrumb label. When dynamic params are needed,
   * use it together with the property `resolver` which will get the i18n key passed in.
   * */
  i18n?: string;

  /**
   * Optional resolver class implementing `PageBreadcrumbResolver`.
   * When used together with property `i18n`, its method #resolverBreadcrumb will be
   * curried with the `i18n` key.
   */
  resolver?: Type<any>;
}

/**
 * Breadcrumb resolver that accepts as parameters:
 * - Angular ActivatedRouteSnapshot
 * - precalculated link based on the ActivatedRouteSnapshot
 * - route breadcrumb config of Spartacus
 *
 * @see `PageBreadcrumbResolver` - more generic breadcrumb resolver,
 *   not based specifically on Angular routes
 */
export interface RouteBreadcrumbResolver {
  /**
   * Turns the route definition (with its breadcrumb config) into the resolved breadcrumb.
   *
   * @param route The Angular ActivatedRouteSnapshot
   * @param breadcrumbConfig Route's breadcrumb config
   * @param path the string URL path to the ActivatedRouteSnapshot
   */
  resolveBreadcrumbs(
    route: ActivatedRouteSnapshot,
    breadcrumbConfig: RouteBreadcrumbConfig,
    path: string
  ): Observable<BreadcrumbMeta[]>;
}