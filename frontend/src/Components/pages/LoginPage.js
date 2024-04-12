import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { doLogin } from '../auth/authindex'
import back from '../images/bg-images/back.jpg'
import dark from '../images/bg-images/dark.jpg'

export default function LoginPage({isDarkMode}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();


  async function loginUser(ev) {
    ev.preventDefault();
    if (email === '' || password === '') {
      toast.error("All Fields must be filled")
    }
    else {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, password
        }),
      })
      const data = await response.json()
      if (data.token) {
        const token = data.token;
        const testResponse = await fetch('http://localhost:4000/test', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        // const testData = await testResponse.text();
        if (testResponse.ok) {
          console.log("test respone")

          doLogin(data, () => {
            toast.success('login successful')
          });
          if (data.User.role === "advocate") {
            navigate("/advocate/dashboard")
            console.log("testData ===> ", data);
          }else{
            navigate("/admin/dashboard")
          }
        } else {
          toast.error("Token verification failed");
        }
      } else {
        toast.error(data.message)
      }
      console.log(data)
    }
  }

  return (
<div style={{backgroundImage:`url(${isDarkMode ? dark: back})`,backgroundSize:'cover',backgroundPosition:'center'}}>
    <div className="container-fliud d-flex justify-content-center align-items-center  " style={{ height: "90vh"  }}>
      <div className="row " style={{backgroundColor:'rgba(255, 255, 255, 0.36)',border:'2px solid black',padding:'30px',height:'50vh',alignItems:'center',justifyItems:'center'}}>
        <form className="col-m-6 col-sm-12" style={{ maxWidth: "60vh",alignItems:'center',margin:"3%",justifyContent:'center'}} onSubmit={loginUser}>
          <h5 >Name</h5>
          <div className="input-group mb-4">
            <input type="email" className="form-control m-2 " id="floatingInput" placeholder="name@example.com"
              value={email} style={{backgroundColor:'transparent',boxShadow:'transparent',borderBottom:' 0.2px solid black'}}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group mb-4">
            <h5>Password</h5>
            <input type="password" className="form-control w-100 m-2" id="floatingPassword" placeholder="Password"
              value={password} style={{backgroundColor:'transparent',boxShadow:'transparent',borderBottom:' 0.2px solid black'}}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button className="btn btn-primary" type='submit' value="Login" style={{backgroundColor:isDarkMode?'#F05941':'blue '}}>Login</button>
          </div>
          
        </form>
      </div>
    </div>
    </div>
  )
}
