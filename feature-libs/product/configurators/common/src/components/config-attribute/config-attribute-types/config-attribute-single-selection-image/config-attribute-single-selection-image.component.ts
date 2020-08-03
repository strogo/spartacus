import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Configurator } from '@spartacus/core';
import { ConfigFormUpdateEvent } from '../../../config-form/config-form.event';
import { ConfigUIKeyGenerator } from '../../../service/config-ui-key-generator';

@Component({
  selector: 'cx-config-attribute-single-selection-image',
  templateUrl: './config-attribute-single-selection-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigAttributeSingleSelectionImageComponent implements OnInit {
  attributeRadioButtonForm = new FormControl('');

  @Input() attribute: Configurator.Attribute;
  @Input() group: string;
  @Input() ownerKey: string;

  @Output() selectionChange = new EventEmitter<ConfigFormUpdateEvent>();

  ngOnInit() {
    this.attributeRadioButtonForm.setValue(this.attribute.selectedSingleValue);
  }

  /**
   * Fired on keyboard event
   * @param event
   * @param index Index of selected value
   */
  onEnter(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      this.onClick(index);
    }
  }

  /**
   * Fired when value was selected
   * @param index Index of selected value
   */
  onClick(index: number): void {
    const event: ConfigFormUpdateEvent = {
      productCode: this.ownerKey,
      changedAttribute: {
        name: this.attribute.name,
        selectedSingleValue: this.attribute.values[index].valueCode,
        uiType: this.attribute.uiType,
      },
      groupId: this.group,
    };

    this.selectionChange.emit(event);
  }

  createAttributeValueIdForConfigurator(
    attribute: Configurator.Attribute,
    value: string
  ): string {
    return ConfigUIKeyGenerator.createAttributeValueIdForConfigurator(
      attribute,
      value
    );
  }

  createAttributeIdForConfigurator(attribute: Configurator.Attribute): string {
    return ConfigUIKeyGenerator.createAttributeIdForConfigurator(attribute);
  }

  createValueUiKey(
    prefix: string,
    attributeId: string,
    valueId: string
  ): string {
    return ConfigUIKeyGenerator.createValueUiKey(prefix, attributeId, valueId);
  }
}