import './Index.css';

const Index = () => {
    return (
        <>
            <div className="wrapper">
                <div className="gradient-box"></div>
                <div className="row options">
                    <div className="column direction">
                        <p>Direction</p>
                        <div className="select-box">
                            <select>
                                <option value="to top">Top</option>
                                <option value="to right top">Right top</option>
                                <option value="to right">Right</option>
                                <option value="to right bottom">Right bottom</option>
                                <option value="to bottom">Bottom</option>
                                <option value="to left bottom">Left bottom</option>
                                <option value="to left">Left</option>
                                <option value="to left top" selected>
                                    Left top
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="column palette">
                        <p>Colors</p>
                        <div className="colors">
                            <input type="color" value="#5665E9" />
                            <input type="color" value="#A271F8" />
                        </div>
                    </div>
                </div>
                <textarea className="row" disabled>
                    background: linear-gradient(to left top, #977DFE, #6878FF);
                </textarea>
                <div className="row buttons">
                    <button className="refresh">Refresh Colors</button>
                    <button className="copy">Copy Code</button>
                </div>
            </div>
            <script></script>
        </>
    );
};

export default Index;
