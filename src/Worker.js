import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, FormGroup, Label, Table, Input} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';
import {Form} from "antd";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const emptyItem = {
    workerId:0,
    workerLastName: '',
    workerName: '',
    workerMiddleName: '',
    workerSalary: 0,
    postId: 0,
    postName: '',
    workerBirthday: new Date(),
    workerDateStartJob: new Date(),
    workerDateEndJob: null,
    workerPassword: '',
}

export default function Worker() {

    const [workers, setWorkers] = useState();
    const [workerList, setWorkerList] = useState();
    const [posts, setPosts] = useState();
    const [postList, setPostList] = useState();
    const [item, setItem] = useState(emptyItem);
    const [action, setAction] = useState("get" );

    useEffect(() =>{
        fetch('http://localhost:8090/worker/getlist')
            .then(response => response.json())
            .then(data => setWorkers(data));
        fetch('http://localhost:8090/post/getlist')
            .then(response => response.json())
            .then(data => setPosts(data));
    }, [action])

    async function remove(id) {
        await fetch(`http://localhost:8090/worker/delete`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });
        setAction("delete");
    }

    async function change(id){
        const worker = await (await fetch(`http://localhost:8090/worker/get`,{method: "POST", body: JSON.stringify(id)})).json();
        setAction("change");
        setItem(worker);
    }

    async function add(){
        setAction("add");
    }

    const view = () => {
        setPostList(posts.map(post => {
            return <option value = {post.postId}>{post.postName}</option>
        }))
        setWorkerList(workers?.map((worker) => {
            if (worker.workerDateEndJob === null) {
                return <tr key={worker.workerId}>
                    <td style={{whiteSpace: 'nowrap'}}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</td>
                    <td>{worker.workerSalary}</td>
                    <td>{worker.postName}</td>
                    <td>{new Date(new Date(worker.workerBirthday).getTime()).toLocaleDateString()}</td>
                    <td>{new Date(new Date(worker.workerDateStartJob).getTime()).toLocaleDateString()}</td>
                    <td></td>
                    <td>{worker.workerPassword}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary"
                                    onClick={() => change(worker.workerId)}>??????????????????????????</Button>
                            <Button size="sm" id="delete-button"
                                    onClick={() => remove(worker.workerId)}>??????????????</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            } else {//??????????, ????????, ??????
                return <tr key={worker.workerId}>
                    <td style={{whiteSpace: 'nowrap'}}>{worker.workerLastName} {worker.workerName} {worker.workerMiddleName}</td>
                    <td>{worker.workerSalary}</td>
                    <td>{worker.postName}</td>
                    <td>{new Date(new Date(worker.workerBirthday).getTime()).toLocaleDateString()}</td>
                    <td>{new Date(new Date(worker.workerDateStartJob).getTime()).toLocaleDateString()}</td>
                    <td>{new Date(new Date(worker.workerDateEndJob).getTime()).toLocaleDateString()}</td>
                    <td>{worker.workerPassword}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary"
                                    onClick={() => change(worker.workerId)}>??????????????????????????</Button>
                            <Button size="sm" id="delete-button"
                                    onClick={() => remove(worker.workerId)}>??????????????</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            }
        }));
    }

    async function handleSubmit() {
        let itemRes = item;
        itemRes.workerBirthday = new Date(item.workerBirthday).getTime();
        itemRes.workerDateStartJob = new Date(item.workerDateStartJob).setDate(new Date(item.workerDateStartJob).getDate());
        if (item.workerDateEndJob != null) itemRes.workerDateEndJob = new Date(item.workerDateEndJob).setDate(new Date(item.workerDateEndJob).getDate());

        await fetch('http://localhost:8090/worker/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemRes),
        });
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item1 = item;
        item1[name] = value;
        setItem(item1)
    }

    function handleDateBirthChange(value){
        let item1 = item;
        item1["workerBirthday"] = value
        setItem(item1)
    }

    function handleDateStartJobChange(value){
        let item1 = item;
        item1["workerDateStartJob"] = value
        setItem(item1)
    }

    function handleDateEndJobChange(value){
        let item1 = item;
        item1["workerDateEndJob"] = value
        setItem(item1)
    }

    if(action === "get" || action === "delete"){
        return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <div className="float-right">
                    <Button color="success" onClick={()=>add()}>???????????????? ????????????????????</Button>
                    <Button color="warning" onClick={()=>view()}>????????????????</Button>
                </div>
                <h3>????????????????????</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="15%">?????? ???????????????????? </th>
                        <th width="15%">???????????????????? ?????????? ????????????????????</th>
                        <th width="15%">???????????????????????? ??????????????????</th>
                        <th width="15%">???????? ???????????????? ????????????????????</th>
                        <th width="15%">???????? ???????????? ???????????? ?? ????????????????</th>
                        <th width="15%">???????? ?????????????????? ???????????? ?? ????????????????</th>
                        <th width="10%">???????????? ????????????????????</th>
                    </tr>
                    </thead>
                    <tbody>
                        {workerList}
                    </tbody>
                </Table>
            </Container>
        </div>
        )
    }
    if(action === "change" || action === "add"){
        const title = <h2>???????????????????????????? ???????????????????? ?? ????????????????????</h2>;
        if(item.workerDateEndJob != null)
        {
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form>
                            <FormGroup>
                                <Label for="workerLastName">?????????????? ????????????????????</Label>
                                <Input type="text" name="workerLastName" id="workerLastName"
                                       defaultValue={item.workerLastName || ''}
                                       onChange={handleChange} autoComplete="workerLastName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerName">?????? ????????????????????</Label>
                                <Input type="text" name="workerName" id="workerName"
                                       defaultValue={item.workerName || ''}
                                       onChange={handleChange} autoComplete="workerName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerMiddleName">???????????????? ????????????????????</Label>
                                <Input type="text" name="workerMiddleName" id="workerMiddleName"
                                       defaultValue={item.workerMiddleName || ''}
                                       onChange={handleChange} autoComplete="workerMiddleName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerSalary">???????????????????? ?????????? ????????????????????</Label>
                                <Input type="text" name="workerSalary" id="workerSalary"
                                       defaultValue={item.workerSalary || ''}
                                       onChange={handleChange} autoComplete="workerSalary"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="postId">???????????????????????? ??????????????????</Label>
                                <select name="postId" id="postId" defaultValue={item.postId || ''}
                                        onChange={handleChange} autoComplete="postId">{postList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerBirthday">???????? ???????????????? ????????????????????</Label>
                                <Calendar value={new Date(new Date(item.workerBirthday).getTime())} onChange={handleDateBirthChange} returnValue={"start"}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerDateStartJob">???????? ???????????? ???????????? ?? ????????????????</Label>
                                <Calendar value={new Date(new Date(item.workerBirthday).getTime())} onChange={handleDateStartJobChange} returnValue={"start"}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerDateEndJob">???????? ?????????????????? ???????????? ?? ????????????????</Label>
                                <Calendar value={new Date(new Date(item.workerBirthday).getTime())} onChange={handleDateEndJobChange} returnValue={"start"}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerPassword">???????????? ????????????????????</Label>
                                <Input type="text" name="workerPassword" id="workerPassword"
                                       defaultValue={item.workerPassword || ''}
                                       onChange={handleChange} autoComplete="workerPassword"/>
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" onClick={() => handleSubmit()}>??????????????????</Button>{' '}
                                <Button color="secondary" onClick={() => setAction("get")}>??????????</Button>
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }else{
            return (
                <div>
                    <AppNavbar/>
                    <Container>
                        {title}
                        <Form>
                            <FormGroup>
                                <Label for="workerLastName">?????????????? ????????????????????</Label>
                                <Input type="text" name="workerLastName" id="workerLastName"
                                       defaultValue={item.workerLastName || ''}
                                       onChange={handleChange} autoComplete="workerLastName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerName">?????? ????????????????????</Label>
                                <Input type="text" name="workerName" id="workerName"
                                       defaultValue={item.workerName || ''}
                                       onChange={handleChange} autoComplete="workerName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerMiddleName">???????????????? ????????????????????</Label>
                                <Input type="text" name="workerMiddleName" id="workerMiddleName"
                                       defaultValue={item.workerMiddleName || ''}
                                       onChange={handleChange} autoComplete="workerMiddleName"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerSalary">???????????????????? ?????????? ????????????????????</Label>
                                <Input type="text" name="workerSalary" id="workerSalary"
                                       defaultValue={item.workerSalary || ''}
                                       onChange={handleChange} autoComplete="workerSalary"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="postId">???????????????????????? ??????????????????</Label>
                                <select name="postId" id="postId" defaultValue={item.postId || ''}
                                        onChange={handleChange} autoComplete="postId">{postList}</select>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerBirthday">???????? ???????????????? ????????????????????</Label>
                                <Calendar value={new Date(new Date(item.workerBirthday).getTime())} onChange={handleDateBirthChange} returnValue={"start"}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerDateStartJob">???????? ???????????? ???????????? ?? ????????????????</Label>
                                <Calendar value={new Date(new Date(item.workerBirthday).getTime())} onChange={handleDateStartJobChange} returnValue={"start"}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerDateEndJob">???????? ?????????????????? ???????????? ?? ????????????????</Label>
                                <Calendar value={new Date()} onChange={handleDateEndJobChange} returnValue={"start"}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="workerPassword">???????????? ????????????????????</Label>
                                <Input type="text" name="workerPassword" id="workerPassword"
                                       defaultValue={item.workerPassword || ''}
                                       onChange={handleChange} autoComplete="workerPassword"/>
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" onClick={ () => handleSubmit()}>??????????????????</Button>{' '}
                                <Button color="secondary" onClick={() => setAction("get")}>??????????</Button>
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            );
        }
    }
}