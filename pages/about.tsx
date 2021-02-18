import {  NextPageContext } from 'next';
import axios from "axios"

const about = ({data}) => {
  return (
    <div>
      <h1>{data}</h1>  
    </div>
  )
}

about.getInitialProps = async (ctx: NextPageContext) => {
  const res = await axios.post("http://localhost:3001/api/test")
  return { data : res.data.msg }
}

export default about;