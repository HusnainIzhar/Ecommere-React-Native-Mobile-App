import React ,{FC} from "react"
import Svg, { SvgProps, Ellipse, Path } from "react-native-svg";

type Props ={
    color?:string;
    fill?:string;
    size?:number;
}
const SalesIcon:FC<Props> = ({color,fill,size}) => (
  <Svg
    width={size ? size : 24}
    height={size ? size : 24}
    fill={fill ? fill : "none"}
    color={color}
  >
    <Ellipse
      cx={15.5}
      cy={11}
      stroke="currentColor"
      strokeWidth={1.5}
      rx={6.5}
      ry={2}
    />
    <Path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M22 15.5c0 1.105-2.91 2-6.5 2s-6.5-.895-6.5-2"
    />
    <Path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M22 11v8.8c0 1.215-2.91 2.2-6.5 2.2S9 21.015 9 19.8V11"
    />
    <Ellipse
      cx={8.5}
      cy={4}
      stroke="currentColor"
      strokeWidth={1.5}
      rx={6.5}
      ry={2}
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M6 11c-1.892-.23-3.63-.825-4-2m4 7c-1.892-.23-3.63-.825-4-2"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M6 21c-1.892-.23-3.63-.826-4-2V4M15 6V4"
    />
  </Svg>
)
export default SalesIcon
