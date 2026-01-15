import { View } from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  Entypo,
  SimpleLineIcons,
  FontAwesome6,
} from "@expo/vector-icons";

type IconLibrary =
  | "material"
  | "fontawesome"
  | "fontawesome6"
  | "ionicons"
  | "community"
  | "antdesign"
  | "feather"
  | "entypo"
  | "simpleline";

// interface IconProps {
type IconProps = {
  name: string;
  size?: number;
  color?: string;
  library?: IconLibrary;
  rotation?: number;
};

export function Icon({
  name,
  size = 24,
  color = "#000",
  library = "material",
  rotation = 0,
}: IconProps) {
  const iconProps: any  = { name, size, color };

  const IconComponent = (() => {
    switch (library) {
      case "material":
        return <MaterialIcons {...iconProps} />;
      case "fontawesome":
        return <FontAwesome {...iconProps} />;
      case "fontawesome6":
        return <FontAwesome6 {...iconProps} />;
      case "ionicons":
        return <Ionicons {...iconProps} />;
      case "community":
        return <MaterialCommunityIcons {...iconProps} />;
      case "antdesign":
        return <AntDesign {...iconProps} />;
      case "feather":
        return <Feather {...iconProps} />;
      case "entypo":
        return <Entypo {...iconProps} />;
      case "simpleline":
        return <SimpleLineIcons {...iconProps} />;
      default:
        return <MaterialIcons {...iconProps} />;
    }
  })();

  return (
    <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      {IconComponent}
    </View>
  );
}

// ============================================
// ICON REFERENCE - Copy & use these names
// ============================================

export const ICON_NAMES = {
  material: {
    home: "home",
    heart: "favorite",
    heartOutline: "favorite-border",
    star: "star",
    starOutline: "star-outline",
    settings: "settings",
    search: "search",
    close: "close",
    check: "check",
    menu: "menu",
    arrowBack: "arrow-back",
    arrowForward: "arrow-forward",
    edit: "edit",
    delete: "delete",
    share: "share",
    info: "info",
    warning: "warning",
    error: "error",
    success: "check-circle",
  },
  community: {
    pool: "pool",
    garden: "garden",
    bed: "bed",
    bathroom: "bathroom",
    kitchen: "chef-hat",
    garage: "garage",
    door: "door",
    window: "window-closed",
    tree: "tree",
    location: "map-marker",
    phone: "phone",
    email: "email",
    whatsapp: "whatsapp",
    instagram: "instagram",
    facebook: "facebook",
    twitter: "twitter",
    linkedin: "linkedin",
    informationVariant: "information-variant",
  },
  fontawesome: {
    heart: "heart",
    heartOutline: "heart-o",
    star: "star",
    starOutline: "star-o",
    share: "share-alt",
    user: "user",
    users: "users",
    home: "home",
    building: "building",
    mapMarker: "map-marker",
    phone: "phone",
    envelope: "envelope",
    camera: "camera",
    image: "image",
    video: "video-camera",
    download: "download",
    upload: "upload",
    trash: "trash",
  },
  ionicons: {
    checkmarkCircle: "checkmark-circle",
    closeCircle: "close-circle",
    home: "home",
    heart: "heart",
    star: "star",
    search: "search",
    settings: "settings",
    menu: "menu",
    close: "close",
    checkmark: "checkmark",
    arrowBack: "arrow-back",
    arrowForward: "arrow-forward",
    image: "image",
    camera: "camera",
    location: "location",
    call: "call",
    mail: "mail",
  },
  feather: {
    home: "home",
    heart: "heart",
    star: "star",
    search: "search",
    settings: "settings",
    menu: "menu",
    x: "x",
    check: "check",
    arrowLeft: "arrow-left",
    arrowRight: "arrow-right",
    mapPin: "map-pin",
    phone: "phone",
    mail: "mail",
    user: "user",
    share2: "share-2",
    download: "download",
    trash2: "trash-2",
    edit: "edit",
    sliders: "sliders",
  },
  antdesign: {
    heart: "heart",
    star: "star",
    home: "home",
    user: "user",
    setting: "setting",
    search: "search",
    close: "close",
    check: "check",
    arrowleft: "arrowleft",
    arrowright: "arrowright",
    delete: "delete",
    edit: "edit",
    phone: "phone",
    mail: "mail",
    link: "link",
    download: "download",
  },
};
