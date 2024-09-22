import { useDispatch, useSelector } from 'react-redux';
import { change } from '../../store/theme';
import './index.scss';

const ThemeSwitch = ({ collapsed }) => {

    const themeColor = useSelector(state => state.theme.value)
    const dispatch = useDispatch()

    document.body.setAttribute("data-theme", themeColor); // 按钮状态默认
    const TOGGLE = () => {
        // 判断是否白天黑夜;
        const willChangeMode = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", willChangeMode);
        dispatch(change())
    };

    return (
        <>
            <div className="container" style={{ fontSize: collapsed ? '.3px' : '.5px' }}>
                <div className="components" onClick={TOGGLE}>
                    <div className="main-button">
                        <div className="moon"></div>
                        <div className="moon"></div>
                        <div className="moon"></div>
                    </div>
                    <div className="daytime-backgrond"></div>
                    <div className="daytime-backgrond"></div>
                    <div className="daytime-backgrond"></div>
                    <div className="cloud">
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                    </div>
                    <div className="cloud-light">
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                        <div className="cloud-son"></div>
                    </div>
                    <div className="stars">
                        <div className="star big">
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                        </div>
                        <div className="star big">
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                        </div>
                        <div className="star medium">
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                        </div>
                        <div className="star medium">
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                        </div>
                        <div className="star small">
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                        </div>
                        <div className="star small">
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                            <div className="star-son"></div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ThemeSwitch