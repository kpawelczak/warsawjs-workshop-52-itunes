import React from "react";

import styles from './App.module.css';
import { Itunes } from './itunes/Itunes'


function App() {
	return (
		<div className={styles["App"]}>
			<Itunes/>
		</div>
	);
}

export default App;
