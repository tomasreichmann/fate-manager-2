import {
  AlertContent,
  ImageContent,
  RichTextContent,
  SheetBlockContent,
  SoundsContent,
} from 'components';

const contentComponents = {
  AlertContent: {
    label: 'Alert',
    component: AlertContent,
    componentName: 'AlertContent',
  },
  ImageContent: {
    label: 'Image',
    component: ImageContent,
    componentName: 'ImageContent',
  },
  RichTextContent: {
    label: 'Rich Text',
    component: RichTextContent,
    componentName: 'RichTextContent',
  },
  SheetBlockContent: {
    label: 'Sheet Blocks',
    component: SheetBlockContent,
    componentName: 'SheetBlockContent',
  },
  SoundsContent: {
    label: 'Sounds',
    component: SoundsContent,
    componentName: 'SoundsContent',
  },
};

export default contentComponents;
