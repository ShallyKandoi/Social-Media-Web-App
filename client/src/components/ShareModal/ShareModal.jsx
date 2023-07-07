import { Modal, useMantineTheme } from '@mantine/core';
import PostShare from '../PostShare/PostShare';

function ShareModal({ modalOpen, setModalOpen}) {
  const theme = useMantineTheme();

  return (
    <>
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        size='600px'
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        
        <PostShare />
      </Modal>
    </>
  );
}

export default ShareModal;