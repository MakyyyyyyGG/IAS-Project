import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Search, Trash, Pencil, PencilLine } from "lucide-react";
import { Input, Textarea } from "@nextui-org/react";
import { LogOut } from "lucide-react";
import { NotebookPen } from "lucide-react";
import Swal from "sweetalert2";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { Chip } from "@nextui-org/chip";
import { useSession, signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Link,
} from "@nextui-org/react";
import { redirect } from "next/dist/server/api-utils";

export default function Home() {
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const { data: session, status } = useSession();
  const [selectedNote, setSelectedNote] = useState(null);
  const [filteredNote, setFilteredNote] = useState([]);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const date = new Date();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const handleSave = async () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      title,
      body,
      created: date.toLocaleDateString("en-US", options),
    };

    const putData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    };

    try {
      const res = await fetch(`/api/users/`, putData);

      if (!res.ok) {
        throw new Error("Failed to update user.");
      }

      const data = await res.json();
      console.log("Updated User:", data);
      const updatedNoteData = data.updatedNote;

      const updatedNotes = notes.map((note) =>
        note.id === updatedNoteData.id ? updatedNoteData : note
      );

      setNotes(updatedNotes);
      setFilteredNote(updatedNotes);
      setSelectedNote(updatedNoteData); // Update selectedNote with the new data

      onEditOpenChange();
      getUsers();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  async function addUser(event) {
    event.preventDefault();

    if (title.trim() === "" || body.trim() === "") {
      Swal.fire({
        title: "Error!",
        text: "Both fields are required.",
        icon: "error",
      });
      return; // Stop execution if validation fails
    }

    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: session.user.email,
        title: title.trim(),
        body: body.trim(),
      }),
    };

    const res = await fetch(`/api/users`, postData);
    const data = await res.json();
    console.log(data);
    getUsers();

    Swal.fire({
      title: "Success!",
      text: "Note added successfully",
      icon: "success",
    });

    setTitle("");
    setBody("");
  }

  async function getUsers() {
    if (!session?.user?.email) return; // Ensure session and email exist

    const getData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(
      `/api/users?author=${session?.user.email}`,
      getData
    );
    const data = await res.json();
    console.log(data.notes);
    setNotes(data.notes);
    setFilteredNote(data.notes);
  }

  async function deleteUser(id) {
    // Show confirmation dialog using Swal
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    // Check if user confirmed deletion
    if (confirmResult.isConfirmed) {
      // Proceed with deletion
      const deleteData = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      };
      try {
        const res = await fetch(`/api/users`, deleteData);
        const data = await res.json();

        if (res.ok) {
          console.log(data);
          // Update the user list after successful deletion
          getUsers();

          // Show success message
          Swal.fire({
            title: "Deleted!",
            text: "Your note has been deleted.",
            icon: "success",
          });
        } else {
          throw new Error(data.message || "Failed to delete note.");
        }
      } catch (error) {
        console.error("Error deleting note:", error);
        // Handle error scenario if needed
        Swal.fire({
          title: "Error!",
          text: "Failed to delete note.",
          icon: "error",
        });
      }
    }
  }

  function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const filteredData = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.body.toLowerCase().includes(query)
    );
    setFilteredNote(filteredData);
  }
  const displayUserDetails = (note) => {
    setSelectedNote(note);
    console.log(note);
  };

  const openEditModal = (note) => {
    setTitle(note.title);
    setBody(note.body);
    setSelectedNote(note);
    onEditOpen();
  };

  useEffect(() => {
    if (status === "authenticated") {
      getUsers();
    }
  }, [status, session]);

  // useEffect(() => {
  //   if (status === "loading") return; // Wait until session is loaded
  //   if (!session) {
  //     // If no session, redirect to login page
  //     router.push("/"); // Replace with your actual login page path
  //   }
  // }, [session, status]);

  return (
    <main className=" w-[1400px] m-auto py-6 font-inter h-screen">
      <nav className="flex rounded-2xl w-full border justify-between items-center bg-[#f5f5f5] p-3 mb-5">
        <img src="/logo.svg" alt="Logo" width={180} height={50} />
        <div className="searchbar w-[600px] bg-[#e0e4f5] rounded-xl p-2 flex">
          <Search color="#545454" />
          <input
            type="text"
            className="w-full bg-[#e0e4f5] outline-none ml-2"
            placeholder="Search your notes"
            onChange={handleSearch}
          ></input>
        </div>
        <div className="div flex mr-2">
          <Dropdown placement="center">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src={session?.user.image}
              />
            </DropdownTrigger>
            {session && (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  {session?.user.name ? (
                    <p>{session.user.name}</p> //this must be name
                  ) : (
                    <p>{session.user.email}</p>
                  )}
                </DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={() =>
                    signOut({ redirect: false }).then(() => router.push("/"))
                  }
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </div>
      </nav>

      <div className="container flex w-full">
        <div className="div  w-1/4 rounded-2xl bg-[#f5f5f5] p-5 overflow-auto h-[580px]">
          <div className="heade flex align-middle ">
            <h1 className="font-bold mx-2 text-3xl text-[#7F76CE]">
              All Notes
            </h1>
          </div>
          {filteredNote.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            filteredNote.map((note) => (
              <Card
                key={note.id}
                className="user my-3 p-2 hover:bg-[#e0e4f5] cursor-pointer focus:bg-[#e0e4f5] focus:border-[#7F76CE] focus:border-1  hover:border-[#7F76CE] hover:border-solid hover:border-1  transition ease duration-250"
              >
                <CardBody
                  className="pb-0"
                  onClick={() => displayUserDetails(note)}
                >
                  <p className="font-bold">{note.title}</p>
                  <p className="text-slate-500 my-3 truncate-3-lines">
                    {note.body}
                  </p>
                </CardBody>
                <CardFooter className="flex justify-between py-0 pb-1">
                  <Chip size="sm" color="primary" variant="flat">
                    {note.updated}
                  </Chip>
                  <div className="optionWrapper flex">
                    <div
                      className="editContainer rounded-full bg-[#e4d4f4] p-2 mr-2 transition ease hover:bg-[#cdbfdb]"
                      onClick={() => {
                        openEditModal(note);
                      }}
                    >
                      <Pencil color="#8a5bda" size={20} />
                    </div>
                    <div className="trashContainer rounded-full bg-red-200 p-2 hover:bg-red-300 transition ease">
                      <Trash
                        color="#f31260"
                        size={20}
                        onClick={() => deleteUser(note.id)}
                      />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        <div className="relative flex-1 w-3/5 mx-7 rounded-2xl bg-[#f5f5f5] overflow-auto h-[580px] p-8">
          <div className="h-[450px]">
            {selectedNote && (
              <div className="userDetails">
                <div className="title text-wrap flex  justify-between">
                  <h1 className="font-bold text-5xl mb-3">
                    {selectedNote.title}
                  </h1>
                  <Chip color="primary" variant="flat" className="ml-1">
                    {selectedNote.updated}
                  </Chip>
                </div>

                <Divider className="mb-3" />
                <p
                  rows={14}
                  className="text-justify bg-transparent w-full row-span-10 p-4"
                >
                  {selectedNote.body}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="div w-1/6 rounded-2xl ">
          <div className="div  rounded-2xl bg-[#e0e4f5] p-3 overflow-auto ">
            <Button
              onClick={onOpen}
              className="w-full h-[70px]  relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-bold text-indigo-600  transition duration-300 ease-out  rounded-xl   group  shadow bg-[#f5f5f5]"
            >
              <span class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-[#7f76ce] group-hover:translate-x-0 ease">
                <PencilLine color="white" size={30} />
                {/* <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg> */}
              </span>
              <span class="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease text-2xl">
                Add Note
              </span>
              <span class="relative invisible">Button Texts</span>
            </Button>
          </div>

          <Modal
            size="3xl"
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col">
                    Add your note
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={addUser} className="flex flex-col gap-2">
                      <Input
                        autoComplete="false"
                        autoFocus
                        type="text"
                        label="Title"
                        name="title"
                        variant="bordered"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <Textarea
                        name="body"
                        minRows={50}
                        label="body"
                        type="text"
                        variant="bordered"
                        onChange={(e) => setBody(e.target.value)}
                      />
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" type="submit" onPress={onClose}>
                        Add Note
                      </Button>
                    </form>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>

      <Modal
        size="3xl"
        backdrop="blur"
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                Edit your note
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-2 ">
                  <Input
                    autoComplete="false"
                    autoFocus
                    type="text"
                    label="Title"
                    name="title"
                    variant="bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    name="body"
                    minRows={50}
                    label="body"
                    type="text"
                    variant="bordered"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      onClose();
                      setTitle("");
                      setBody("");
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    type="button"
                    onPress={() => {
                      handleSave();
                      setTitle("");
                      setBody("");
                    }}
                  >
                    Save Note
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
