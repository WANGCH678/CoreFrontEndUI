import type { ComponentType } from 'react';
import Accordions from './components/01_accordion';
import TabMenus from './components/02_tabMenu';
import Tooltip from './components/03_tooltip';
import ReactiveTextBoxes from './components/04_reactiveTextBox';
import LineClamp from './components/05_lineClamp';
import Forms from './components/06_form';
import LazyLoad1 from './components/07_lazyLoading/1_r';
import LazyLoad2 from './components/07_lazyLoading/2_r';
import LazyLoad3_V from './components/07_lazyLoading/3_v';
import LazyLoad4 from './components/07_lazyLoading/4_r';
import TraditionalPagination from './components/08_pagination/1_traditional';
import InfiniteScrollR from './components/08_pagination/2_infiniteScroll';
import InfiniteScrollV from './components/08_pagination/3_infiniteScrollV';
import Carousels from './components/09_carousel';
import ScrollSpy1 from './components/10_scrollSpy/1_r';
import ScrollSpy2 from './components/10_scrollSpy/2_r';
import ScrollSpy3 from './components/10_scrollSpy/3_r';
import Snackbar1V from './components/11_snackbar/1_v';
import Snackbar2 from './components/11_snackbar/2_r';
import Snackbar3_1 from './components/11_snackbar/3-1_r';
import Snackbar3_2 from './components/11_snackbar/3-2_r';
import Modal1 from './components/12_modal/1_r';
import Modal2 from './components/12_modal/2_r';
import Modal3V from './components/12_modal/3_v';
import Modal4 from './components/12_modal/4_r';
import Modal5 from './components/12_modal/5_r';

const _routeMap = {
  root: {
    name: 'root',
    children: [
      'accordion', 'tabMenu', 'tooltip', 'reactiveTextBox', 'lineClamp', 'form', 'lazyLoading', 'pagination', 'carousel', 'scrollSpy', 'snackbar', 'modal'
    ],
  },
  accordion: {
    name: '01. 아코디언',
    Component: Accordions
  },
  tabMenu: {
    name: '02. 탭 메뉴',
    Component: TabMenus
  },
  tooltip: {
    name: '03. 툴팁',
    Component: Tooltip
  },
  reactiveTextBox: {
    name: '04. 반응형 텍스트 박스',
    Component: ReactiveTextBoxes
  },
  lineClamp: {
    name: '05. 여러줄 말줄임',
    Component: LineClamp
  },
  form: {
    name: '06. 폼',
    Component: Forms
  },
  lazyLoading: {
    link: 'lazyLoading/1_r',
    name: '07. 지연 로딩',
    children: ['lazyLoading/1_r', 'lazyLoading/2_r', 'lazyLoading/3_v', 'lazyLoading/4_r']
  },
  'lazyLoading/1_r': {
    name: '1R 직접계산',
    Component: LazyLoad1
  },
  'lazyLoading/2_r': {
    name: '2R IO + native',
    Component: LazyLoad2
  },
  'lazyLoading/3_v': {
    name: '3V Vanilla',
    Component: LazyLoad3_V
  },
  'lazyLoading/4_r': {
    name: '4R 작은 이미지',
    Component: LazyLoad4
  },
  pagination: {
    link: 'pagination/1_traditional',
    name: '08. 페이지네이션',
    children: ['pagination/1_traditional', 'pagination/2_infiniteScrollR', 'pagination/3_infiniteScrollV'],
  },
  'pagination/1_traditional': {
    name: '1R 내비게이션 바',
    Component: TraditionalPagination
  },
  'pagination/2_infiniteScrollR': {
    name: '2R 무한 스크롤',
    Component: InfiniteScrollR
  },
  'pagination/3_infiniteScrollV': {
    name: '3V 무한 스크롤',
    Component: InfiniteScrollV
  },
  carousel: {
    name: '09. 캐러셀',
    Component: Carousels
  },
  scrollSpy: {
    link: 'scrollSpy/1_r',
    name: '10. 스크롤 스파이',
    children: ['scrollSpy/1_r', 'scrollSpy/2_r', 'scrollSpy/3_r']
  },
  'scrollSpy/1_r': {
    name: '1R scroll event',
    Component: ScrollSpy1
  },
  'scrollSpy/2_r': {
    name: '2R IntersectionObserver',
    Component: ScrollSpy2
  },
  'scrollSpy/3_r': {
    name: '3R IO + ScrollBox',
    Component: ScrollSpy3
  },
  snackbar: {
    link: 'snackbar/1_v',
    name: '11. 스낵바',
    children: ['snackbar/1_v', 'snackbar/2_r', 'snackbar/3-1_r', 'snackbar/3-2_r']
  },
  'snackbar/1_v': {
    name: '1V',
    Component: Snackbar1V
  },
  'snackbar/2_r': {
    name: '2R Context',
    Component: Snackbar2
  },
  'snackbar/3-1_r': {
    name: '3-1R Portal',
    Component: Snackbar3_1
  },
  'snackbar/3-2_r': {
    name: '3-2R Hook Portal',
    Component: Snackbar3_2
  },
    modal: {
        link: 'modal/1_r',
        name: '12. 모달',
        children: ['modal/1_r', 'modal/2_r', 'modal/3_v', 'modal/4_r', 'modal/5_r']
  },
  'modal/1_r': {
    name: '1R context',
    Component: Modal1
  },
  'modal/2_r': {
    name: '2R createPortal',
    Component: Modal2
  },
  'modal/3_v': {
    name: '3V Vanilla',
    Component: Modal3V
  },
    'modal/4_r': {
        name: '4R HTML dialog',
        Component: Modal4
    },
    'modal/5_r': {
        name: '5R html dialog (2)',
        Component: Modal5
    }
};

export type RoutePath = keyof typeof _routeMap;

type BaseRoute = { name: string; link?: RoutePath };
export type ParentRoute = BaseRoute & { children: RoutePath[] };
export type ChildRoute = BaseRoute & { Component: ComponentType | null };
export type Route = ChildRoute | ParentRoute;
export const routeMap = _routeMap as Record<RoutePath, Route>;

export const isParentRoute = (route: Route): route is ParentRoute =>
  route != null && 'children' in route;
export const gnbRootList: [RoutePath, Route][] = (
  routeMap.root as ParentRoute
).children.map(r => [r, routeMap[r]]);
