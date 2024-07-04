import  React, {FC} from "react"
import Svg, {  Path } from "react-native-svg"

type Props = {
    color?: string,
    fill?: string,
    size?: number
    
}
const AnalyticIcon:FC<Props> = ({color ,fill ,size}) => (
  <Svg
    width={size ? size : 24}
    height={size ? size : 24}
    fill={fill ? fill : "none"}
    color={color}
  >
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 18v-2m5 2v-3m5 3v-5M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109C18.717 21.5 16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391C2.5 18.717 2.5 16.479 2.5 12Z"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.992 11.486c2.155.072 7.042-.253 9.822-4.665m-1.822-.533 1.876-.302c.228-.029.564.152.647.367l.495 1.638"
    />
  </Svg>
)
export default AnalyticIcon
