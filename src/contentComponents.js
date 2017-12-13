import {
  AlertContent,
  ImageContent,
  RichTextContent,
  SheetBlockContent,
  SoundsContent,
  DocumentLinkContent,
  VideoPlayerContent,
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
  DocumentLinkContent: {
    icon: 'FaExternalLink',
    label: 'Link',
    component: DocumentLinkContent,
    componentName: 'DocumentLinkContent',
  },
  VideoPlayerContent: {
    icon: 'MdOndemandVideo',
    label: 'Video player',
    component: VideoPlayerContent,
    componentName: 'VideoPlayerContent',
  },
};

export default contentComponents;
