export type loadedJson = {
  options: {
    height: number | `${number}px`;
    width: number | `${number}px`;
    color: string;
    func_name: string;
    name: string;
    global_className: string;
    output: string;
  };
  icons: Record<string, string>;
};
