import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/button';
import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text
  } from '@chakra-ui/react'
  import { Image } from '@chakra-ui/react';

const ProfileModal = ({ user , children }) => {

    const { isOpen ,onOpen ,onClose } = useDisclosure();

  return (
    <div>
     {children ? (
        <span onClick={onOpen}>{children}</span>
     ): (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
     )}
     <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
        h="400px"
        >
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
          >
           <Image 
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}
           />
           <Text fontSize={{base: "28px" , md: "30px"}}
           fontFamily="Work sans">
            Email: {user.email}
           </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModal