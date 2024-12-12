
export type StarItem = {
  name: string;
  html_url: string;
  owner: {
    login: string;
    html_url: string;
  };
  description: string;
  [props: string]: any;
}
