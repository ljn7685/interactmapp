export default function useShareMessage(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.info = {};
        }
        onShareAppMessage() {
            console.log("onShareAppMessage");
            return this.info;
        }
        setShareInfo = (info) => {
            this.info = info;
        };
        render() {
            const newProps = { setShareInfo: this.setShareInfo };
            return (
                <WrappedComponent
                    {...this.props}
                    {...newProps}
                ></WrappedComponent>
            );
        }
    };
}