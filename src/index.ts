import {
  useState,
  useEffect,
  useCallback,
} from 'preact/hooks';
import {ComponentChild, Fragment,FunctionComponent,createElement} from 'preact'
import unified, { PluggableList } from 'unified';
import remarkParse, { RemarkParseOptions } from 'remark-parse';
import { Options as RemarkRehypeOptions } from 'mdast-util-to-hast';
import remarkToRehype from 'remark-rehype';
import rehypeReact, { Options as RehypeReactOptions } from 'rehype-react';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface UseRemarkSyncOptions {
  remarkParseOptions?: RemarkParseOptions;
  remarkToRehypeOptions?: RemarkRehypeOptions;
  rehypeReactOptions?: PartialBy<
    RehypeReactOptions<any>,
    'createElement'
  >;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

export const useRemarkSync = (
  source: string,
  {
    remarkParseOptions,
    remarkToRehypeOptions,
    rehypeReactOptions,
    remarkPlugins = [],
    rehypePlugins = [],
  }: UseRemarkOptions = {}
): ComponentChild =>
  unified()
    .use(remarkParse, remarkParseOptions)
    .use(remarkPlugins)
    .use(remarkToRehype, remarkToRehypeOptions)
    .use(rehypePlugins)
    .use(rehypeReact, {
      createElement,
      Fragment,
      ...rehypeReactOptions,
    } as RehypeReactOptions<typeof createElement>)
    .processSync(source).result as any;

export interface UseRemarkOptions extends UseRemarkSyncOptions {
  onError?: (err: Error) => void;
}

export const useRemark = ({
  remarkParseOptions,
  remarkToRehypeOptions,
  rehypeReactOptions,
  remarkPlugins = [],
  rehypePlugins = [],
  onError = () => {},
}: UseRemarkOptions = {}): [ComponentChild | null, (source: string) => void] => {
  const [reactContent, setReactContent] = useState<ComponentChild | null>(null);

  const setMarkdownSource = useCallback((source: string) => {
    unified()
      .use(remarkParse, remarkParseOptions)
      .use(remarkPlugins)
      .use(remarkToRehype, remarkToRehypeOptions)
      .use(rehypePlugins)
      .use(rehypeReact, {
        createElement,
        Fragment,
        ...rehypeReactOptions,
      } as RehypeReactOptions<typeof createElement>)
      .process(source)
      .then((vfile) => setReactContent(vfile.result as ComponentChild))
      .catch(onError);
  }, []);

  return [reactContent, setMarkdownSource];
};

export interface RemarkProps extends UseRemarkOptions {
  children: string;
}

export const Remark: FunctionComponent<RemarkProps> = ({
  children,
  ...useRemarkOptions
}: RemarkProps) => {
  const [reactContent, setMarkdownSource] = useRemark(useRemarkOptions);

  useEffect(() => {
    setMarkdownSource(children);
  }, [children, setMarkdownSource]);

  return reactContent;
};
