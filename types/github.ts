export type FlatTagType = {
  name: string;
}


export type StarItem = {
  name: string;
  html_url: string;
  owner: {
    login: string;
    html_url: string;
  };
  description: string;
  tags?: FlatTagType[];
  [props: string]: any;
}
