import { type MarkedExtension } from 'marked';
import * as extensions from './extensions.ts';

export default function(): MarkedExtension {
  return {
    async: false,
    gfm: true,
    breaks: false,
    extensions: Object.values(extensions),
  };
}
