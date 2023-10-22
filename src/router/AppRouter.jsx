import { Route, Routes } from "react-router-dom"
import {Client} from "../components/pages/Clients/Client"
import { Products } from "../components/pages/Products/Products"
import { ClientPage } from "../components/pages/ClientPage"
import { Profile } from "../components/pages/profile/Profile"

export const  AppRouter=()=> {

  //  const authStatus = 'not-authenticated'

//  console.log( getEnvVariables())
  return (


    <Routes>
        
            <Route path="/"           element={ <Client/>}></Route>
            <Route path="/client/*"   element={ <Client/>}></Route>
            <Route path="/products/*" element={ <Products/>}></Route>
            <Route path="/profile/*"  element={ <Profile/>}></Route>
            <Route path="*"           element={ <Client/>}></Route>



    </Routes>


    
  )
}
