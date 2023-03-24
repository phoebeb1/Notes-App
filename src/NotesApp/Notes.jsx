import React, { useState } from 'react';
import _ from 'lodash-es';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import notesArray from './notesArray';

const Notes = () => {
    const [gridView, setGridView] = useState(true);
    const [newNoteShow, setNewNoteShow] = useState(false);
    const [editNoteShow, setEditNoteShow] = useState(false);
    const [editNote, setEditNote] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [sortBy, setSortBy] = useState('New');
    const [notesData, setNotesData] = useState(notesArray);

    const orderedNotes = () => {
        if (sortBy === 'Old') {
            return notesData.sort((a, b) => {
                const aDate = a.date.split('-').reverse().join();
                const bDate = b.date.split('-').reverse().join();
                const aTime = a.time;
                const bTime = b.time;
                return aDate < bDate
                    ? -1
                    : (
                        aDate > bDate
                            ? 1
                            : (
                                aTime < bTime
                                    ? -1
                                    : (
                                        aTime > bTime
                                            ? 1
                                            : 0
                                    )
                            )
                    );
            });            
        } else if (sortBy === 'AZ') {
            return notesData.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'ZA') {
            return notesData.sort((a, b) => a.title.localeCompare(b.title)).reverse();
        } else {
            return notesData.sort((a, b) => {
                const aDate = a.date.split('-').reverse().join();
                const bDate = b.date.split('-').reverse().join();
                const aTime = a.time;
                const bTime = b.time;
                return aDate > bDate
                    ? -1
                    : (
                        aDate < bDate
                            ? 1
                            : (
                                aTime > bTime
                                    ? -1
                                    : (
                                        aTime < bTime
                                            ? 1
                                            : 0
                                    )
                            )
                    );
            });
        }
    };

    const ListNotes = (props) => {
        const {
            orderedNotes,
        } = props;
    
        return (
            <Tab.Container id="notesListGroup" defaultActiveKey="#note0">
                <Row>
                    <Col sm={4}>
                    <ListGroup>
                        {orderedNotes.map((note, index) => (
                            (note.title.toLowerCase().includes(searchValue) || note.body.toLowerCase().includes(searchValue)) &&
                                (
                                    <ListGroup.Item eventKey={`#note${index}`}>
                                        {note.title}
                                        <br />
                                        {note.date}
                                    </ListGroup.Item>
                                )
                            
                        ))}
                    </ListGroup>
                    </Col>
                    <Col sm={8}>
                    <Tab.Content>
                        {orderedNotes.map((note, index) => (
                            (note.title.toLowerCase().includes(searchValue) || note.body.toLowerCase().includes(searchValue)) &&
                                (
                                    <Tab.Pane eventKey={`#note${index}`}>
                                        <h5>
                                            {note.title}
                                        </h5>
                                        <br />
                                        {note.body}
                                        <br />
                                        {''}
                                        <br />
                                        <ButtonGroup className="tabButtons">
                                            <Button variant="outline-light" onClick={() => {setEditNoteShow(true); setEditNote(note);}}>
                                                <i className="fa fa-edit"></i>
                                            </Button>
                                            <Button variant="outline-light" onClick={() => deleteNote(note)}>
                                                <i className="fa fa-trash"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </Tab.Pane>
                                )
                        ))}
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    };
    
    const GridNotes = (props) => {
        const {
            orderedNotes,
        } = props;
    
        const [showButtons, setShowButtons] = useState(false);
        const [cardToShow, setCardToShow] = useState('');
    
        return (
            <CardGroup>
                <Row className="mx-0 gridRow">
                {orderedNotes.map((note) => (
                    (note.title.toLowerCase().includes(searchValue) || note.body.toLowerCase().includes(searchValue)) &&
                        (
                            <Col sm={4} className="mb-1 p-1">
                                <Card
                                    className="gridCards p-1"
                                    onMouseEnter={(e) => {
                                        setShowButtons(true);
                                        setCardToShow(note.title);
                                    }}
                                    onMouseLeave={(e) => {
                                        setShowButtons(false)
                                    }}>
                                    <Card.Body>
                                        <Card.Title>{note.title}</Card.Title>
                                        {note.body}
                                        <br />
                                        {''}
                                        <br />
                                        {note.date}
                                        <br />
                                        <ButtonGroup>
                                            <Button variant="outline-light" style={(cardToShow === note.title && showButtons) ? {display: 'block'} : {display: 'none'}} onClick={() => {setEditNoteShow(true); setEditNote(note);}}>
                                                <i className="fa fa-edit"></i>
                                            </Button>
                                            <Button variant="outline-light" style={(cardToShow === note.title && showButtons) ? {display: 'block'} : {display: 'none'}} onClick={() => deleteNote(note)}>
                                                <i className="fa fa-trash"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                ))}
                </Row>
            </CardGroup>
        )
    };
    
    const NewNote = (props) => {
        const {
            show,
            onHide,
        } = props;
    
        const handleSubmit = (evt) => {
            evt.preventDefault();
            const { target } = evt;
            const date = new Date();
            const yyyy = date.getFullYear();
            let mm = date.getMonth() + 1;
            let dd = date.getDate();
            const time = date.toLocaleTimeString();
            
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            
            const formattedDate = dd + '-' + mm + '-' + yyyy;
    
            const newNoteData = {
                title: target[0].value,
                body: target[1].value,
                date: formattedDate,
                time: time,
            }

            notesData.push(newNoteData);
            setNotesData(notesData);
            onHide();
        };
    
        return (
            <Modal
                size="lg"
                aria-labelledby="newNoteModal"
                centered
                show={show}
                onHide={onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="newNoteTitle">
                        New Note
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="mb-3" onSubmit={(evt) => handleSubmit(evt)}>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Control
                                placeholder="Title"
                                aria-label="newNoteTitle"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBody">
                            <Form.Control
                                placeholder="Write your note here"
                                aria-label="newNoteBody"
                                as="textarea"
                            /> 
                        </Form.Group>
                        <Button variant="outline-light" type="submit">Save</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        )
    }
    
    const EditNote = (props) => {
        const {
            show,
            onHide,
        } = props;
    
        const updateNote = (evt) => {
            evt.preventDefault();

            const date = new Date();
            const yyyy = date.getFullYear();
            let mm = date.getMonth() + 1;
            let dd = date.getDate();
            const time = date.toLocaleTimeString();
            
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            
            const formattedDate = dd + '-' + mm + '-' + yyyy;

            const noteIndex = _.findIndex(notesData, (note) => {
                return note.title === editNote.title
                    && note.body === editNote.body
                    && note.date === editNote.date
                    && note.time === editNote.time;
            });

            notesData[noteIndex] = {
                title: evt.target[0].value,
                body: evt.target[1].value,
                date: formattedDate,
                time: time,
            };

            setEditNoteShow(false);
        };
    
        return (
            <Modal
                size="lg"
                aria-labelledby="editNoteModal"
                centered
                show={show}
                onHide={onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="newNoteTitle">
                        Edit Note
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="mb-3" onSubmit={(evt) => updateNote(evt)}>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Control
                                defaultValue={editNote.title}
                                aria-label="editNoteTitle"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBody">
                            <Form.Control
                                defaultValue={editNote.body}
                                aria-label="editNoteBody"
                                as="textarea"
                            /> 
                        </Form.Group>
                        <Button variant="outline-light" type="submit">Save</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        )
    };
    
    const deleteNote = (props) => {
        const {
            title,
            body,
            date,
        } = props;
    
        setNotesData(_.filter(notesData, (note) => { 
            return !(note.title === title && note.body === body && note.date === date);
        }));
    };

    return (
        <Container className="notesContainer p-2">
            <h1>Notes</h1>
            <Row className="m-0 mb-2 toolbar">
                <Button className="mr-1" variant="outline-light" size="lg" onClick={() => setNewNoteShow(true)}>
                    <i className="fa fa-plus"></i>
                </Button>
                <Form>
                    <Form.Control
                        size="lg"
                        variant="light"
                        type="search"
                        className="searchbar"
                        placeholder="Search"
                        aria-label="Search"
                        onChange={(evt) => setSearchValue(evt.target.value.toLowerCase())}
                    />
                </Form>
                <ButtonGroup className="mx-1" aria-label="notesLayout" size="lg">
                    <Button variant="outline-light" onClick={() => setGridView(true)}>
                        <i className="fa fa-th-large"></i>
                    </Button>
                    <Button variant="outline-light" onClick={() => setGridView(false)}>
                        <i className="fa fa-list"></i>
                    </Button>
                </ButtonGroup>
                <Dropdown>
                    <Dropdown.Toggle id="sortByDropdown" variant="outline-light" size="lg">
                        <i className="fa fa-sort"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSortBy('New')}>
                            {sortBy === 'New' && <i className="fa fa-check"></i>}
                            Newest to Oldest
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortBy('Old')}>
                            {sortBy === 'Old' && <i className="fa fa-check"></i>}
                            Oldest to Newest
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortBy('AZ')}>
                            {sortBy === 'AZ' && <i className="fa fa-check"></i>}
                            A-Z
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSortBy('ZA')}>
                            {sortBy === 'ZA' && <i className="fa fa-check"></i>}
                            Z-A
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            {gridView
                ? <GridNotes
                    orderedNotes={orderedNotes()}
                />
                : <ListNotes
                    orderedNotes={orderedNotes()}
                />
            }
            <NewNote
                show={newNoteShow}
                onHide={() => setNewNoteShow(false)}
            />
            <EditNote
                show={editNoteShow}
                onHide={() => setEditNoteShow(false)}
            />
        </Container>
    )
};

export default Notes;