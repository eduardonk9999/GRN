import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react"
import { GET_USERS } from "../App";
import { client } from "../lib/apollo";

const CREATE_USER = gql`
  mutation($name: String!) {
    createUser(name: $name) {
      id,
      name
    }
  }

`

export function NewUserForm() {
  const [name, setName] = useState('');
  const [createUser, {data, loading, error}] = useMutation(CREATE_USER)

  async function handleCreatUser(envent: FormEvent) {
    envent.preventDefault()

    if(!name){
      return
    }
    await createUser({
       variables: {
         name
       },
      update: (cache, { data: { createUser } }) => {
        const { users } = client.readQuery({ query: GET_USERS })

        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: [
              ...users,
              createUser, 
            ]
          }
        })
      }
       
    })
    console.log(data)
  }
  return(
    <form onSubmit={handleCreatUser}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Enviar</button>
    </form>
  )
}