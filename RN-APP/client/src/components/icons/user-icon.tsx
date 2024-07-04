import React, {FC} from "react"
import Svg, { SvgProps, Path } from "react-native-svg";

type Props ={
    color:string,
    fill? :string,
    size?:number
}
const UserIcon :FC<Props> = ({color ,fill,size}) => (
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
      d="M6.578 15.482c-1.415.842-5.125 2.562-2.865 4.715C4.816 21.248 6.045 22 7.59 22h8.818c1.546 0 2.775-.752 3.878-1.803 2.26-2.153-1.45-3.873-2.865-4.715a10.663 10.663 0 0 0-10.844 0Z"
    />
    <Path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M16.5 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
    />
  </Svg>
)
export default UserIcon
