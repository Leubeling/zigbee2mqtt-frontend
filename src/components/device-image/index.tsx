import React, { FunctionComponent, ImgHTMLAttributes, useState } from "react";
import genericDevice from "../../images/generic-zigbee-device.png";
import { Device } from "../../types";
import cx from "classnames";
type DeviceImageProps = {
    device: Device;
    type?: "img" | "svg";
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const genericDeiviceImageFallback = (device: Device): string => genericDevice;
const genSlsDeviceImageUrlZ2M = (device: Device): string => `https://www.zigbee2mqtt.io/images/devices/${device?.definition?.model?.replace(/:|\s|\//g, "-")}.jpg`;
const genSlsDeviceImageUrlSLS = (device: Device): string => `https://slsys.github.io/Gateway/devices/png/${device?.definition?.model?.replace("/", "_")}.png`;

const AVALIABLE_GENERATORS = [
    genSlsDeviceImageUrlZ2M, genSlsDeviceImageUrlSLS, genericDeiviceImageFallback
]

const DeviceImage: FunctionComponent<DeviceImageProps & ImgHTMLAttributes<HTMLDivElement | SVGImageElement>> = (props) => {
    const [imageGenerators, setimageGenerators] = useState(AVALIABLE_GENERATORS);
    const { device, type = "img", className, ...rest } = props;
    const src = imageGenerators.length ? imageGenerators[0](device) : false;
    const onImageError = () => {
        const newGenerators = [...imageGenerators];
        newGenerators.shift();
        setimageGenerators(newGenerators);
    };
    const interviewSpinner = device.interviewing ? <i title="Interviewing" className="fa fa-spinner fa-spin position-absolute bottom-0 right-0" /> : null;
    const unseccessfullInterview = !device.interviewing && !device.interview_completed ? <i title="Interview failed" className="fa fa-exclamation-triangle position-absolute top-0 right-0 text-danger" /> : null;
    switch (type) {
        case "svg":
            return src ? <image {...rest} onError={onImageError} href={src} /> : null;
        case "img":
        default:
            return src ? <div className={cx(className, "position-relative")} {...rest}>
                <img  onError={onImageError} src={src} className={"position-relative"} />
                {interviewSpinner}
                {unseccessfullInterview}
            </div> : null;
    }
}
export default DeviceImage;