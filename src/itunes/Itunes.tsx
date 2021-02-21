import React, { useEffect, useLayoutEffect, useState } from 'react';

import './Itunes.css';

import {
	Button,
	CircularProgress,
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

import useDebounce from '../hooks/useDebounce';

const TdModal = (props: any) => {

	return <Modal isOpen={props.isOpen} onClose={props.onClose}>
		<ModalOverlay/>
		<ModalContent style={{ paddingBottom: '24px' }}>
			<ModalHeader>{props.result.trackName}</ModalHeader>
			<ModalCloseButton/>
			<ModalBody dangerouslySetInnerHTML={{ __html: props.result.description }}>
			</ModalBody>
		</ModalContent>
	</Modal>;
};

const ItunesBook = (props: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return <>
		<TdModal result={props.result}
				 isOpen={isOpen}
				 onClose={onClose}/>
		<Tr className={'book'}
			onClick={onOpen}>
			<Td>
				<Image src={props.result.artworkUrl60} alt={'result artwork'}/>
			</Td>
			<Td style={{ fontSize: '18px', fontWeight: 'bold' }}>{props.result.trackName}</Td>
			<Td>{props.result.artistName}</Td>
			<Td isNumeric style={{ textAlign: 'center' }}>
				{props.result.price === 0 ? 'free' : `${props.result.price} ${props.result.currency}`}
			</Td>

		</Tr>
	</>;
};

const ItunesBooks = (props: any) => {

	return props.results.map((result: any) => (
			<ItunesBook key={result.trackId}
						result={result}/>
		)
	);
};

export function Itunes() {
	const [results, setResults] = useState([]);

	const [searchTerm, setSearchTerm] = useState('');
	const [searchTermInput, setSearchTermInput] = useState('typescript');
	const [isLoading, setLoading] = useState(false);

	const debouncedSearchTerm = useDebounce(searchTermInput, 500);

	useLayoutEffect(() => {
		fetchBooks();
	}, []);

	useEffect(() => {
		fetchBooks();
	}, [debouncedSearchTerm]);

	const fetchBooks = () => {

		if (!searchTermInput) {
			return;
		}
		setLoading(true);
		fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTermInput)}&entity=ebook`)
			.then((response: Response) => response.json()
												  .then((data) => {
													  setResults(data.results);
													  setSearchTerm(searchTermInput);
												  }))
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Stack style={{ padding: '24px' }}>

			<Stack direction="row">
				<Input value={searchTermInput} onChange={(event: any) => setSearchTermInput(event.target.value)}/>
				{isLoading && <CircularProgress isIndeterminate
												color="green.300"
												size={10}/>}
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
					</Tr>
				</Thead>
				<Tbody>
					<ItunesBooks results={results}/>
				</Tbody>

			</Table>
		</Stack>
	);
}
