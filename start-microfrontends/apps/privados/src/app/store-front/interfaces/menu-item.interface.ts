export interface MenuItem {
  title: string;
  route?: string;
  subitems?: { title: string; route: string }[];
  open?: boolean;
}
