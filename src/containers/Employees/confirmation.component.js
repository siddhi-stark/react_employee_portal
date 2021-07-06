import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Form, Button } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import {
  Datepicker,
} from '../../components/FormInputs';

function Confirmation() {
  const [description, setDescription] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setDescription(editorState);
  };

	return (
<>
<div>
<p>Employee Name</p>
<section className="content-area">

 <Form>
<Col md={4}>
<Datepicker
                  label="Joining Date"
                  className="form-control"
                  // selected={joiningDate}
                  placeholder="dd/mm/yyyy"
                  // maxDate={maxdate}
                  dateFormat="dd/MM/yyyy"
                  // maxDate={new Date()}
                  // onChange={(e) => {
                  //   setJoiningDate(e);
                  // }}
                  // errorMessage={validator.message(
                  //   'Joining Date',
                  //   joiningDate,
                  //   'required'
                  // )}
                />
</Col> 

<Col md={6}>
  <Editor
                         // readOnly={viewType}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      editorState={description}
                      onEditorStateChange={(e)=>{onEditorStateChange(e);}}
                       toolbar={{
                        options: ['inline', 'fontSize', 'fontFamily', 'list', 'textAlign', 'link', 'history'],
                         fontSize : {
                        options: [ 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100]
                      },
                        list : {
                          options: ['unordered', 'ordered'],
                        }    
                      }}
                      />
</Col> 

<div className="justify-content-left mt-4">
              <Button variant="primary">
                Save
              </Button>

              <Button
                variant="primary"
                type="submit"
                className="ms-4"
              >
               Preview and Send
              </Button>
            </div>
 </Form>
</section>



</div>
</>
		)
}

export default withRouter(Confirmation);