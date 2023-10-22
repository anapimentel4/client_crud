
import { BrowserRouter } from 'react-router-dom'
import {AppRouter} from './router'

export const CompApp =() =>{
    return (
        <BrowserRouter>
       <AppRouter/>
       </BrowserRouter>
    )
}
export default CompApp