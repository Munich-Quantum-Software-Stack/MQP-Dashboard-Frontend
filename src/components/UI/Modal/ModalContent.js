import ContentCard from '@components/UI/Card/ContentCard';
import Button from '@components/UI/Button/Button';
import classes from './Modal.module.css';

/** Basic modal layout with title, message, and action button */
const ModalContent = (props) => {
  return (
    <ContentCard className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.title}</h2>
      </header>
      <div className={classes.content}>
        <p>{props.message}</p>
      </div>
      <footer className={classes.actions}>
        <Button onClick={props.onConfirm}>{props.buttonText}</Button>
      </footer>
    </ContentCard>
  );
};

export default ModalContent;
