import  React ,{FC} from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

type Props={
    color?: string,
    fill?: string,
    size?: number
}
const CategoryIcon :FC<Props> = ({color ,fill,size}) => (
  <Svg
    width={size ? size : 24}
    height={size ? size : 24}
    fill={fill ? fill : "none"}
    color={color}
  >
    <Path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M15.5 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM22 17.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9 17.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
    />
  </Svg>
)
export default CategoryIcon