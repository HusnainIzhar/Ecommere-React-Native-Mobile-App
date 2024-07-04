import  React ,{FC} from "react"
import Svg, { SvgProps, Path, Circle } from "react-native-svg";

type Props={
    color?: string,
    fill?: string,
    size?: number

}
const CartIcon :FC<Props> = ({color,fill,size}) => (
  <Svg
    width={size ? size : 24}
    height={size ? size : 24}
    fill={fill ? fill : "none"}
    color={color}
  >
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m8 16 8.72-.727c2.729-.227 3.341-.823 3.643-3.544L21 6M6 6h1.5M22 6h-3"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.5 7s1 0 2 2c0 0 3.177-5 6-6"
    />
    <Circle cx={6} cy={20} r={2} stroke="currentColor" strokeWidth={1.5} />
    <Circle cx={17} cy={20} r={2} stroke="currentColor" strokeWidth={1.5} />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M8 20h7M2 2h.966c.945 0 1.768.625 1.997 1.515L7.94 15.076c.15.585.021 1.204-.35 1.686L6.631 18"
    />
  </Svg>
)
export default CartIcon
