export interface AuthorBoxProps {
  name: string;
  bio?: string;
  avatar?: string;
  /** The mono tag beside the name. Defaults to "Instructor". */
  role?: string;
  /** Social or profile links, rendered into .ns-authorbox__links. */
  links?: React.ReactNode;
  className?: string;
}
