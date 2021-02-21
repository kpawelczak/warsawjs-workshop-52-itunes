import React, { useLayoutEffect, useState } from 'react';

import {
	Button,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure
} from '@chakra-ui/react';

const TdModal = (props: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return <>
		<Button onClick={onOpen}>Description</Button>

		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay/>
			<ModalContent style={{ paddingBottom: '24px' }}>
				<ModalHeader>{props.result.trackName}</ModalHeader>
				<ModalCloseButton/>
				<ModalBody dangerouslySetInnerHTML={{ __html: props.result.description }}>
				</ModalBody>
			</ModalContent>
		</Modal>
	</>;
};

const ItunesBooks = (props: any) => {

	return props.results.map((result: any, i: number) => (
			<Tr key={`result-${i}`}>
				<Td>
					<Image src={result.artworkUrl60} alt={'result artwork'}/>
				</Td>
				<Td style={{ fontSize: '18px', fontWeight: 'bold' }}>{result.trackName}</Td>
				<Td>{result.artistName}</Td>
				<Td isNumeric style={{ textAlign: 'center' }}>
					{result.price === 0 ? 'free' : `${result.price} ${result.currency}`}
				</Td>
				<Td style={{ textAlign: 'center' }}>
					<TdModal result={result}/>
				</Td>
			</Tr>
		)
	);
};

export function Itunes() {
	const [results, setResults] = useState([]);

	const [searchTerm, setSearchTerm] = useState('');
	const [searchTermInput, setSearchTermInput] = useState('typescript');

	useLayoutEffect(() => {
		fetchBooks();
	}, []);

	const fetchBooks = () => {
		fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTermInput)}&entity=ebook`)
			.then((response: Response) => response.json()
												  .then((data) => {
													  setResults(data.results);
													  setSearchTerm(searchTermInput);
												  }));
	};

	return (
		<Stack style={{ padding: '24px' }}>

			<Stack direction="row">
				<Input value={searchTermInput} onChange={(event: any) => setSearchTermInput(event.target.value)}/>
				<Button colorScheme="blue" onClick={() => {
					fetchBooks();
				}}>Search</Button>
			</Stack>

			<h1 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '24px', fontSize: '24px' }}>
				{results.length > 0 && `iTunes Ebooks for "${searchTerm}"`}
			</h1>

			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Artwork</Th>
						<Th>Name</Th>
						<Th>Author</Th>
						<Th isNumeric style={{ textAlign: 'center' }}>price</Th>
						<Th style={{ textAlign: 'center' }}>Description</Th>
					</Tr>
				</Thead>
				<Tbody>
					<ItunesBooks results={results}/>
				</Tbody>

			</Table>
		</Stack>
	);
}
