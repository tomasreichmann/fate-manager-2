import {
  AlertContent,
  ImageContent,
  RichTextContent,
  SheetBlockContent,
  SoundsContent,
} from 'components';

const contentComponents = {
  AlertContent: {
    icon: 'FaExclamationTriangle',
    label: 'Alert',
    component: AlertContent,
    componentName: 'AlertContent',
  },
  ImageContent: {
    icon: 'FaImage',
    label: 'Image',
    component: ImageContent,
    componentName: 'ImageContent',
  },
  RichTextContent: {
    icon: 'FaFileTextO',
    label: 'Rich Text',
    component: RichTextContent,
    componentName: 'RichTextContent',
  },
  SheetBlockContent: {
    icon: 'FaNewspaperO',
    label: 'Sheet Blocks',
    component: SheetBlockContent,
    componentName: 'SheetBlockContent',
  },
  SoundsContent: {
    icon: 'FaFileAudioO',
    label: 'Sounds',
    component: SoundsContent,
    componentName: 'SoundsContent',
  },
};

export default contentComponents;
