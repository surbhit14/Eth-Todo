import { Button, HStack, Input } from '@chakra-ui/react';
import { useState } from 'react';
import Web3 from "web3";
import Contract from '../contract/Todo.json';

function AddTodo({ addTodo,setLoading,setCnt }) {
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let web3 = new Web3(window.ethereum);
    const cnt = new web3.eth.Contract(
      Contract,
      "0x4AFfa4c6e3dBFF8D5cd43ce688B2f2f2eeA64B3f");
    const rec= await cnt.methods.createTask(content).send({from:accounts[0]});
    let count=await cnt.methods.taskCount().call();
    const todo = {
      id: count+1,
      body: content,
    };

    addTodo(todo);
    console.log(rec);
    setContent('');
    setLoading(false);
  }

  const [content, setContent] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      <HStack mt='8'>
        <Input
          variant='filled'
          placeholder='Write the task'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button colorScheme='pink' px='8' type='submit'>
          Add Todo
        </Button>
      </HStack>
    </form>
  );
}

export default AddTodo;
