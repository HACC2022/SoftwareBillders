import { useState } from "react";
import { doc, setDoc } from "@firebase/firestore";
import { firestore } from "../firebase/firebaseClient";

const Testimony_Form = ({ testimonyDocument }) => {

  const writeTestimony = (documentPath: string, testimonyContent: string, sendTo: string) => {
    setDoc(doc(firestore, documentPath), {status: sendTo, content: testimonyContent}, {merge: true})
  }

  const [assignedPerson, setAssignedPerson] = useState('');
  const [testimonyContent, setTestimonyContent] = useState(testimonyDocument.data().content);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('assignedPerson', assignedPerson);
    console.log('testimonyContent', testimonyContent);
    writeTestimony(`draft-testimony/${testimonyDocument.data().bill}-testimony`,testimonyContent,assignedPerson);
    setAssignedPerson('');
    setTestimonyContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <span>Assign testimony to person (email currently but can be changed): </span>
      <input
        itemID={`assignedPerson-${testimonyDocument.id}`}
        type="text"
        onChange={event => setAssignedPerson(event.target.value)}
        value={assignedPerson}
      />
      <br/>
      <span>Testimony content (any text can be put here): </span>
      <textarea
        itemID={`testimony-content-${testimonyDocument.id}`}
        value={testimonyContent}
        onChange={event => setTestimonyContent(event.target.value)}
      />
      <br/>
      <button type="submit" itemID={`submit-${testimonyDocument.id}`}>Submit form</button>
    </form>
  )
}

export default Testimony_Form;
